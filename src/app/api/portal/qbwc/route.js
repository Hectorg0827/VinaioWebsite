import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * QuickBooks Web Connector (QBWC) SOAP Bridge
 * This endpoint handles the communication between the office PC and the portal.
 */

export async function GET() {
  // Returns a basic WSDL if accessed via GET
  return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?>
    <definitions name="QBWebConnectorSvc"
      targetNamespace="http://developer.intuit.com/"
      xmlns:tns="http://developer.intuit.com/"
      xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
      xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/"
      xmlns="http://schemas.xmlsoap.org/wsdl/">
      <service name="QBWebConnectorSvc">
        <port name="QBWebConnectorSvcSoap" binding="tns:QBWebConnectorSvcSoap">
          <soap:address location="${process.env.NEXT_PUBLIC_SITE_URL}/api/portal/qbwc"/>
        </port>
      </service>
    </definitions>`, {
      headers: { "Content-Type": "text/xml" }
    });
}

export async function POST(req) {
  const xml = await req.text();
  const supabase = createAdminClient();

  // Simple XML parsing to find the SOAP method name
  const methodMatch = xml.match(/<[^:]+:(\w+) xmlns/);
  const method = methodMatch ? methodMatch[1] : null;

  if (!method) return new NextResponse("Invalid SOAP request", { status: 400 });

  let responseBody = "";

  try {
    switch (method) {
      case "authenticate": {
        const username = xml.match(/<strUserName>(.*?)<\/strUserName>/)?.[1];
        const password = xml.match(/<strPassword>(.*?)<\/strPassword>/)?.[1];
        
        // Validate against ADMIN_PASSWORD from env
        const isValid = password === process.env.ADMIN_PASSWORD;
        const sessionId = crypto.randomUUID();

        if (isValid) {
          // Success: Return [SessionID, ""]
          // The empty string means "use the default QB company file that is open"
          responseBody = `
            <authenticateResponse xmlns="http://developer.intuit.com/">
              <authenticateResult>
                <string>${sessionId}</string>
                <string></string> 
              </authenticateResult>
            </authenticateResponse>`;
        } else {
          responseBody = `
            <authenticateResponse xmlns="http://developer.intuit.com/">
              <authenticateResult>
                <string>${sessionId}</string>
                <string>nvu</string>
              </authenticateResult>
            </authenticateResponse>`;
        }
        break;
      }

      case "clientVersion":
        responseBody = `
          <clientVersionResponse xmlns="http://developer.intuit.com/">
            <clientVersionResult></clientVersionResult>
          </clientVersionResponse>`;
        break;

      case "sendRequestXML": {
        // Here we decide what to ask QB for.
        // For Step 1, let's just ask for Invoices and Customers.
        // In a real app, you'd check a "sync queue" in Supabase.
        const qbxml = `<?xml version="1.0" ?>
          <?qbxml version="13.0"?>
          <QBXML>
            <QBXMLMsgsRq onError="continueOnError">
              <CustomerQueryRq requestID="1">
                <MaxReturned>100</MaxReturned>
                <ActiveStatus>ActiveOnly</ActiveStatus>
              </CustomerQueryRq>
              <InvoiceQueryRq requestID="2">
                <MaxReturned>50</MaxReturned>
                <IncludeLineItems>true</IncludeLineItems>
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
        // This is where QB sends the data back.
        // We would parse the XML and update Supabase.
        // For now, we'll log it and tell QB we are done (100).
        console.log("RECEIVED RESPONSE FROM QB");

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
        <soap:Body>
          ${responseBody}
        </soap:Body>
      </soap:Envelope>`;

    return new NextResponse(envelope, {
      headers: { "Content-Type": "text/xml" }
    });

  } catch (err) {
    console.error("QBWC Bridge Error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
