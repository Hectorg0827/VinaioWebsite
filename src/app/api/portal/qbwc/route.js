import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * QUICKBOOKS WEB CONNECTOR (QBWC) BRIDGE
 * Vinaio Trade Partner Portal
 * 
 * This file handles the SOAP communication between QuickBooks Desktop and Supabase.
 */

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?>
    <definitions name="QBWebConnectorSvc"
      targetNamespace="http://developer.intuit.com/"
      xmlns:tns="http://developer.intuit.com/"
      xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
      xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/"
      xmlns="http://schemas.xmlsoap.org/wsdl/">
      <service name="QBWebConnectorSvc">
        <port name="QBWebConnectorSvcSoap" binding="tns:QBWebConnectorSvcSoap">
          <soap:address location="${siteUrl}/api/portal/qbwc"/>
        </port>
      </service>
    </definitions>`, {
      headers: { "Content-Type": "text/xml" }
    });
}

export async function POST(req) {
  const xml = await req.text();
  const supabase = createAdminClient();

  const methodMatch = xml.match(/<[^:]+:(\w+) xmlns/);
  const method = methodMatch ? methodMatch[1] : null;

  if (!method) return new NextResponse("Invalid SOAP request", { status: 400 });

  let responseBody = "";

  try {
    switch (method) {
      case "authenticate": {
        const password = xml.match(/<strPassword>(.*?)<\/strPassword>/)?.[1];
        const isValid = password === process.env.ADMIN_PASSWORD;
        const sessionId = crypto.randomUUID();

        // Log check-in
        await supabase.from("sync_status").insert([{ 
          status: isValid ? "running" : "error", 
          message: isValid ? "Office PC connected" : "Auth failed",
          sync_type: "auth"
        }]);

        responseBody = `
          <authenticateResponse xmlns="http://developer.intuit.com/">
            <authenticateResult>
              <string>${sessionId}</string>
              <string>${isValid ? "" : "nvu"}</string> 
            </authenticateResult>
          </authenticateResponse>`;
        break;
      }

      case "clientVersion":
        responseBody = `
          <clientVersionResponse xmlns="http://developer.intuit.com/">
            <clientVersionResult></clientVersionResult>
          </clientVersionResponse>`;
        break;

      case "sendRequestXML": {
        const qbxml = `<?xml version="1.0" ?>
          <?qbxml version="13.0"?>
          <QBXML>
            <QBXMLMsgsRq onError="continueOnError">
              <CustomerQueryRq requestID="1">
                <MaxReturned>50</MaxReturned>
                <ActiveStatus>ActiveOnly</ActiveStatus>
              </CustomerQueryRq>
              <InvoiceQueryRq requestID="2">
                <MaxReturned>20</MaxReturned>
                <IncludeLineItems>false</IncludeLineItems>
              </InvoiceQueryRq>
            </QBXMLMsgsRq>
          </QBXML>`;

        responseBody = `
          <sendRequestXMLResponse xmlns="http://developer.intuit.com/">
            <sendRequestXMLResult><![CDATA[${qbxml}]]></sendRequestXMLResult>
          </sendRequestXMLResponse>`;
        break;
      }

      case "receiveResponseXML": {
        const hresult = xml.match(/<hresult>(.*?)<\/hresult>/)?.[1];
        const responseData = xml.match(/<strResponse>(.*?)<\/strResponse>/)?.[1] || "";
        
        // Basic extraction logic (Regex based for speed and low dependency)
        if (responseData.includes("CustomerRet")) {
          // Sync Customers to Supabase
          const customers = parseQBXMLCustomers(responseData);
          for (const c of customers) {
            await supabase.from("customers").upsert({
              qbd_listid: c.ListID,
              qbd_editsequence: c.EditSequence,
              company: c.Name,
              account_number: c.AccountNumber || c.Name,
              balance: parseFloat(c.TotalBalance || 0),
              last_sync_at: new Date().toISOString()
            }, { onConflict: 'qbd_listid' });
          }
        }

        if (responseData.includes("InvoiceRet")) {
          // Sync Invoices to Supabase
          const invoices = parseQBXMLInvoices(responseData);
          for (const inv of invoices) {
            // Find linked customer by ListID if possible
            const { data: cust } = await supabase.from("customers").select("id").eq("qbd_listid", inv.CustomerListID).single();
            
            await supabase.from("invoices").upsert({
              id: inv.TxnID,
              customer_id: cust?.id,
              qbd_customer_id: inv.CustomerListID,
              invoice_number: inv.RefNumber,
              amount: parseFloat(inv.AppliedAmount || inv.Amount || 0),
              balance: parseFloat(inv.BalanceRemaining || 0),
              status: parseFloat(inv.BalanceRemaining) === 0 ? 'paid' : 'open',
              due_date: inv.DueDate,
              qbd_editsequence: inv.EditSequence,
              last_sync_at: new Date().toISOString()
            }, { onConflict: 'id' });
          }
        }

        responseBody = `
          <receiveResponseXMLResponse xmlns="http://developer.intuit.com/">
            <receiveResponseXMLResult>100</receiveResponseXMLResult>
          </receiveResponseXMLResponse>`;
        break;
      }

      case "closeConnection":
        responseBody = `
          <closeConnectionResponse xmlns="http://developer.intuit.com/">
            <closeConnectionResult>OK</closeConnectionResult>
          </closeConnectionResponse>`;
        break;

      default:
        responseBody = `<${method}Response xmlns="http://developer.intuit.com/"></${method}Response>`;
    }

    const envelope = `<?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>${responseBody}</soap:Body>
      </soap:Envelope>`;

    return new NextResponse(envelope, {
      headers: { "Content-Type": "text/xml" }
    });

  } catch (err) {
    console.error("QBWC Bridge Error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// ── UTILITIES ────────────────────────────────────────────────────────────────

function parseQBXMLCustomers(xml) {
  const results = [];
  const re = /<CustomerRet>([\s\S]*?)<\/CustomerRet>/g;
  let match;
  while ((match = re.exec(xml)) !== null) {
    const inner = match[1];
    results.push({
      ListID: inner.match(/<ListID>(.*?)<\/ListID>/)?.[1],
      EditSequence: inner.match(/<EditSequence>(.*?)<\/EditSequence>/)?.[1],
      Name: inner.match(/<Name>(.*?)<\/Name>/)?.[1],
      AccountNumber: inner.match(/<AccountNumber>(.*?)<\/AccountNumber>/)?.[1],
      TotalBalance: inner.match(/<TotalBalance>(.*?)<\/TotalBalance>/)?.[1]
    });
  }
  return results;
}

function parseQBXMLInvoices(xml) {
  const results = [];
  const re = /<InvoiceRet>([\s\S]*?)<\/InvoiceRet>/g;
  let match;
  while ((match = re.exec(xml)) !== null) {
    const inner = match[1];
    results.push({
      TxnID: inner.match(/<TxnID>(.*?)<\/TxnID>/)?.[1],
      EditSequence: inner.match(/<EditSequence>(.*?)<\/EditSequence>/)?.[1],
      CustomerListID: inner.match(/<CustomerRef>[\s\S]*?<ListID>(.*?)<\/ListID>/)?.[1],
      RefNumber: inner.match(/<RefNumber>(.*?)<\/RefNumber>/)?.[1],
      Amount: inner.match(/<AppliedAmount>(.*?)<\/AppliedAmount>/)?.[1] || inner.match(/<Amount>(.*?)<\/Amount>/)?.[1],
      BalanceRemaining: inner.match(/<BalanceRemaining>(.*?)<\/BalanceRemaining>/)?.[1],
      DueDate: inner.match(/<DueDate>(.*?)<\/DueDate>/)?.[1]
    });
  }
  return results;
}
