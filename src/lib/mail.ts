import nodemailer from "nodemailer";
import { db } from "./db";

export async function sendOrderNotificationEmail(orderId: string) {
  try {
    // Fetch the order with user, address, and items (with products)
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        address: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      console.error(`[MAIL] Order with ID ${orderId} not found in database.`);
      return { success: false, error: "Order not found" };
    }

    const customerName = order.user?.name || "Anonymous";
    const customerEmail = order.user?.email || "N/A";
    const totalAmount = parseFloat(order.totalAmount.toString()).toFixed(2);
    
    // Format shipping address
    const addr = order.address;
    const shippingAddress = addr 
      ? `${addr.street}, ${addr.city}, ${addr.state} - ${addr.postalCode}, ${addr.country}`
      : "N/A";

    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const adminOrderUrl = `${baseUrl}/admin/orders?search=${order.id}`;

    // Generate HTML items list
    let itemsHtml = "";
    order.items.forEach((item) => {
      const productName = item.product?.name || "Custom Designer Item";
      const itemPrice = parseFloat(item.price.toString()).toFixed(2);
      const itemTotal = (parseFloat(item.price.toString()) * item.quantity).toFixed(2);
      const options = [];
      if (item.size) options.push(`Size: ${item.size}`);
      if (item.color) options.push(`Color: ${item.color}`);
      const optionsText = options.length > 0 ? `<br/><span style="font-size: 12px; color: #718096;">(${options.join(", ")})</span>` : "";

      itemsHtml += `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #E2E8F0;">
            <span style="font-weight: 600; color: #1A202C;">${productName}</span>
            ${optionsText}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #E2E8F0; text-align: center; color: #4A5568;">
            ${item.quantity}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #E2E8F0; text-align: right; color: #4A5568;">
            ₹${itemPrice}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #E2E8F0; text-align: right; font-weight: 600; color: #1A202C;">
            ₹${itemTotal}
          </td>
        </tr>
      `;
    });

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || "587");
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASSWORD ? process.env.SMTP_PASSWORD.replace(/\s+/g, "") : undefined;
    const smtpFrom = process.env.SMTP_FROM || "Fox Falcon <noreply@foxfalcon.com>";
    const adminEmail = process.env.ADMIN_EMAIL || "admin@foxfalcon.com";

    const emailSubject = `🚨 New Order Received! Order #${order.id}`;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Order Notification</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F7FAFC; padding: 24px; margin: 0;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); overflow: hidden; border: 1px solid #E2E8F0;">
            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #DD6B20 0%, #ED8936 100%); padding: 32px 24px; text-align: center;">
                <h1 style="color: #FFFFFF; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; text-transform: uppercase;">Fox Falcon Store</h1>
                <p style="color: #FEEBC8; margin: 8px 0 0 0; font-size: 14px; font-weight: 600;">NEW ORDER ALERT</p>
              </td>
            </tr>
            
            <!-- Body -->
            <tr>
              <td style="padding: 32px 24px;">
                <h2 style="color: #1A202C; margin: 0 0 16px 0; font-size: 18px; font-weight: 700;">Order #${order.id} Details</h2>
                
                <!-- Customer Details -->
                <table width="100%" style="margin-bottom: 24px; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 6px 0; width: 120px; font-weight: 600; color: #4A5568; font-size: 14px;">Customer:</td>
                    <td style="padding: 6px 0; color: #1A202C; font-size: 14px;">${customerName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-weight: 600; color: #4A5568; font-size: 14px;">Email:</td>
                    <td style="padding: 6px 0; color: #1A202C; font-size: 14px;">${customerEmail}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-weight: 600; color: #4A5568; font-size: 14px;">Payment Method:</td>
                    <td style="padding: 6px 0; color: #1A202C; font-size: 14px; font-weight: bold;">${order.status === 'PENDING' ? 'Cash On Delivery (COD)' : 'Prepaid (Card)'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-weight: 600; color: #4A5568; font-size: 14px; vertical-align: top;">Shipping To:</td>
                    <td style="padding: 6px 0; color: #1A202C; font-size: 14px; line-height: 1.4;">${shippingAddress}</td>
                  </tr>
                </table>

                <!-- Order Items -->
                <table width="100%" style="border-collapse: collapse; margin-bottom: 32px; font-size: 14px;">
                  <thead>
                    <tr style="background-color: #F7FAFC;">
                      <th style="padding: 12px; text-align: left; font-weight: 700; color: #4A5568; border-bottom: 2px solid #E2E8F0;">Product</th>
                      <th style="padding: 12px; text-align: center; font-weight: 700; color: #4A5568; border-bottom: 2px solid #E2E8F0;">Qty</th>
                      <th style="padding: 12px; text-align: right; font-weight: 700; color: #4A5568; border-bottom: 2px solid #E2E8F0;">Price</th>
                      <th style="padding: 12px; text-align: right; font-weight: 700; color: #4A5568; border-bottom: 2px solid #E2E8F0;">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                    <!-- Total Row -->
                    <tr>
                      <td colspan="3" style="padding: 16px 12px; text-align: right; font-weight: 700; color: #4A5568; font-size: 16px;">Grand Total:</td>
                      <td style="padding: 16px 12px; text-align: right; font-weight: 800; color: #ED8936; font-size: 18px; border-top: 2px solid #E2E8F0;">₹${totalAmount}</td>
                    </tr>
                  </tbody>
                </table>

                <!-- Action Button -->
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center">
                      <a href="${adminOrderUrl}" target="_blank" style="display: inline-block; background-color: #ED8936; color: #FFFFFF; font-weight: 700; font-size: 16px; padding: 14px 28px; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 6px rgba(237, 137, 54, 0.3); transition: background-color 0.2s;">
                        Manage Order in Admin Panel
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #F7FAFC; padding: 24px; text-align: center; border-top: 1px solid #E2E8F0; font-size: 12px; color: #A0AEC0;">
                <p style="margin: 0;">This is an automated operational email sent to system administrators.</p>
                <p style="margin: 4px 0 0 0;">&copy; ${new Date().getFullYear()} Fox Falcon. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    // Fallback block if SMTP is not configured
    if (!smtpHost || !smtpUser || !smtpPass) {
      console.log("\n==================================================================");
      console.log("🚨 [MAIL FALLBACK] SMTP Credentials not fully configured in .env.");
      console.log(`To: ${adminEmail}`);
      console.log(`From: ${smtpFrom}`);
      console.log(`Subject: ${emailSubject}`);
      console.log("------------------------------------------------------------------");
      console.log(`Customer: ${customerName} (${customerEmail})`);
      console.log(`Shipping Address: ${shippingAddress}`);
      console.log(`Payment: ${order.status === 'PENDING' ? 'COD' : 'Card'}`);
      console.log("Items:");
      order.items.forEach((item) => {
        const productName = item.product?.name || "Custom Designer Item";
        console.log(`  - ${productName} (x${item.quantity}) - ₹${parseFloat(item.price.toString()).toFixed(2)}`);
      });
      console.log(`Grand Total: ₹${totalAmount}`);
      console.log(`Admin Link: ${adminOrderUrl}`);
      console.log("==================================================================\n");
      return { success: true, mode: "fallback_console_logged" };
    }

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Send the email
    const info = await transporter.sendMail({
      from: smtpFrom,
      to: adminEmail,
      subject: emailSubject,
      html: emailHtml,
    });

    console.log(`[MAIL] Order notification email sent successfully: ${info.messageId}`);
    return { success: true, mode: "smtp_sent", messageId: info.messageId };

  } catch (error) {
    console.error("[MAIL_ERROR] Failed to process order notification email:", error);
    return { success: false, error };
  }
}

export async function sendUserOrderStatusEmail(orderId: string, status: string) {
  try {
    // Fetch the order with user, address, and items (with products)
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        address: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      console.error(`[MAIL] Order with ID ${orderId} not found in database.`);
      return { success: false, error: "Order not found" };
    }

    const customerEmail = order.user?.email;
    if (!customerEmail) {
      console.error(`[MAIL] User email not found for Order ID ${orderId}.`);
      return { success: false, error: "Customer email not found" };
    }

    const customerName = order.user?.name || "Customer";
    const totalAmount = parseFloat(order.totalAmount.toString()).toFixed(2);
    
    // Format shipping address
    const addr = order.address;
    const shippingAddress = addr 
      ? `${addr.street}, ${addr.city}, ${addr.state} - ${addr.postalCode}, ${addr.country}`
      : "N/A";

    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const trackOrderUrl = `${baseUrl}/track-order?orderId=${order.id}`;

    // Generate HTML items list
    let itemsHtml = "";
    order.items.forEach((item) => {
      const productName = item.product?.name || "Custom Designer Item";
      const itemPrice = parseFloat(item.price.toString()).toFixed(2);
      const itemTotal = (parseFloat(item.price.toString()) * item.quantity).toFixed(2);
      const options = [];
      if (item.size) options.push(`Size: ${item.size}`);
      if (item.color) options.push(`Color: ${item.color}`);
      const optionsText = options.length > 0 ? `<br/><span style="font-size: 12px; color: #718096;">(${options.join(", ")})</span>` : "";

      itemsHtml += `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #E2E8F0;">
            <span style="font-weight: 600; color: #1A202C;">${productName}</span>
            ${optionsText}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #E2E8F0; text-align: center; color: #4A5568;">
            ${item.quantity}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #E2E8F0; text-align: right; color: #4A5568;">
            ₹${itemPrice}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #E2E8F0; text-align: right; font-weight: 600; color: #1A202C;">
            ₹${itemTotal}
          </td>
        </tr>
      `;
    });

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || "587");
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASSWORD ? process.env.SMTP_PASSWORD.replace(/\s+/g, "") : undefined;
    const smtpFrom = process.env.SMTP_FROM || "Fox Falcon <noreply@foxfalcon.com>";

    const emailSubject = `🎉 Your Order #${order.id} is now ${status.toLowerCase()}!`;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Status Update</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F7FAFC; padding: 24px; margin: 0;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); overflow: hidden; border: 1px solid #E2E8F0;">
            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #DD6B20 0%, #ED8936 100%); padding: 32px 24px; text-align: center;">
                <h1 style="color: #FFFFFF; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; text-transform: uppercase;">Fox Falcon Store</h1>
                <p style="color: #FEEBC8; margin: 8px 0 0 0; font-size: 14px; font-weight: 600;">ORDER CONFIRMED &amp; PROCESSING</p>
              </td>
            </tr>
            
            <!-- Body -->
            <tr>
              <td style="padding: 32px 24px;">
                <h2 style="color: #1A202C; margin: 0 0 8px 0; font-size: 20px; font-weight: 700;">Hello ${customerName},</h2>
                <p style="color: #4A5568; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">Great news! Your order has been reviewed by our admin and is now **being processed**. We are preparing your premium items for shipment. Here are your order details:</p>
                
                <h3 style="color: #1A202C; margin: 0 0 16px 0; font-size: 16px; font-weight: 700; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px;">Order Summary (ID: #${order.id})</h3>
                
                <!-- Order Items -->
                <table width="100%" style="border-collapse: collapse; margin-bottom: 32px; font-size: 14px;">
                  <thead>
                    <tr style="background-color: #F7FAFC;">
                      <th style="padding: 12px; text-align: left; font-weight: 700; color: #4A5568; border-bottom: 2px solid #E2E8F0;">Product</th>
                      <th style="padding: 12px; text-align: center; font-weight: 700; color: #4A5568; border-bottom: 2px solid #E2E8F0;">Qty</th>
                      <th style="padding: 12px; text-align: right; font-weight: 700; color: #4A5568; border-bottom: 2px solid #E2E8F0;">Price</th>
                      <th style="padding: 12px; text-align: right; font-weight: 700; color: #4A5568; border-bottom: 2px solid #E2E8F0;">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                    <!-- Total Row -->
                    <tr>
                      <td colspan="3" style="padding: 16px 12px; text-align: right; font-weight: 700; color: #4A5568; font-size: 16px;">Grand Total:</td>
                      <td style="padding: 16px 12px; text-align: right; font-weight: 800; color: #ED8936; font-size: 18px; border-top: 2px solid #E2E8F0;">₹${totalAmount}</td>
                    </tr>
                  </tbody>
                </table>

                <!-- Shipping Address -->
                <div style="background-color: #F7FAFC; padding: 20px; border-radius: 8px; border: 1px solid #E2E8F0; margin-bottom: 32px;">
                  <h4 style="color: #4A5568; margin: 0 0 8px 0; font-size: 14px; font-weight: 700; text-transform: uppercase;">Shipping Address</h4>
                  <p style="color: #1A202C; margin: 0; font-size: 14px; line-height: 1.5;">${shippingAddress}</p>
                </div>
 
                <!-- Action Button -->
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center">
                      <a href="${trackOrderUrl}" target="_blank" style="display: inline-block; background-color: #ED8936; color: #FFFFFF; font-weight: 700; font-size: 16px; padding: 14px 28px; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 6px rgba(237, 137, 54, 0.3); transition: background-color 0.2s;">
                        Track Your Order Live
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
 
            <!-- Footer -->
            <tr>
              <td style="background-color: #F7FAFC; padding: 24px; text-align: center; border-top: 1px solid #E2E8F0; font-size: 12px; color: #A0AEC0;">
                <p style="margin: 0;">If you have any questions, please contact our support team.</p>
                <p style="margin: 4px 0 0 0;">&copy; ${new Date().getFullYear()} Fox Falcon. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    // Fallback block if SMTP is not configured
    if (!smtpHost || !smtpUser || !smtpPass) {
      console.log("\n==================================================================");
      console.log(`🚨 [USER MAIL FALLBACK] SMTP Credentials not configured.`);
      console.log(`To: ${customerEmail}`);
      console.log(`From: ${smtpFrom}`);
      console.log(`Subject: ${emailSubject}`);
      console.log("------------------------------------------------------------------");
      console.log(`Customer: ${customerName} (${customerEmail})`);
      console.log(`Status: ${status}`);
      console.log(`Grand Total: ₹${totalAmount}`);
      console.log(`Track Link: ${trackOrderUrl}`);
      console.log("==================================================================\n");
      return { success: true, mode: "fallback_console_logged" };
    }

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Send the email
    const info = await transporter.sendMail({
      from: smtpFrom,
      to: customerEmail,
      subject: emailSubject,
      html: emailHtml,
    });

    console.log(`[MAIL] User status update email sent successfully: ${info.messageId}`);
    return { success: true, mode: "smtp_sent", messageId: info.messageId };

  } catch (error) {
    console.error("[MAIL_ERROR] Failed to send order status update email:", error);
    return { success: false, error };
  }
}
