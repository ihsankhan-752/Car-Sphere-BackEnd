import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API);

export const sendInquiryFormEmail = async ({
  userEmail,
  username,
  title,
  description,
}) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `CarSphere Inquiry <${process.env.RESEND_FROM_EMAIL}>`,
      to: ["ihsankhan886644@gmail.com"],
      reply_to: userEmail,
      subject: `New Vehicle Inquiry: ${title}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #0D6EFD; border-bottom: 2px solid #0D6EFD; padding-bottom: 10px;">New Vehicle Inquiry</h2>
          <div style="margin: 20px 0;">
            <p><strong>Interested Buyer:</strong> ${username}</p>
            <p><strong>Email:</strong> ${userEmail}</p>
            <p><strong>Vehicle:</strong> ${title}</p>
          </div>
          <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #0D6EFD; border-radius: 5px;">
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${description}</p>
          </div>
          <p style="font-size: 12px; color: #888; text-align: center; margin-top: 30px;">Sent from CarSphere Digital Showroom</p>
        </div>
      `,
    });
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Email Service Error:", err);
    throw err;
  }
};
