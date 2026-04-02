import nodemailer from "nodemailer";
import { envVars } from "../config/env";
import status from "http-status";
import path from "path";
import ejs from "ejs";
import AppError from "../error-helpers/AppError";

export const transporter = nodemailer.createTransport({
    host: envVars.EMAIL_SENDER.SMTP_HOST,
    port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
    secure: true,
    auth: {
        user: envVars.EMAIL_SENDER.SMTP_USER,
        pass: envVars.EMAIL_SENDER.SMTP_PASS,
    },
});

interface SendEmailOptions {
    to: string;
    subject: string;
    html?: string;
    templateName: string;
    templateData: Record<string, any>;
    attachments?: {
        filename: string;
        content: string | Buffer;
        contentType: string;
    }[];
}

export const sendEmail = async ({ to, subject, templateName, templateData, attachments }: SendEmailOptions) => {
    try {
        const templatePath = path.resolve(process.cwd(), `src/app/templates/${templateName}.ejs`);
        // console.log({ templatePath })
        // console.log({ templateData })
        const html = await ejs.renderFile(templatePath, templateData)

        const info = await transporter.sendMail({
            from: envVars.EMAIL_SENDER.SMTP_FROM,
            to,
            subject,
            html,
            attachments: attachments?.map((attachment) => ({
                filename: attachment.filename,
                content: attachment.content,
                contentType: attachment.contentType,
            })),
        });
        // console.log(`Email sent to ${to} with message ID ${info.messageId}`);
    } catch (error) {
        // console.log("Error sending email", error);
        throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to send email");
    }
};
