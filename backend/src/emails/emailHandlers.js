import { resendClient, sender } from "../config/resend.js"
import { createWelcomeEmailTemplate } from "./emailTemplates.js"

export const sendWelcomeEmail = async (email, name, clientURL) => {
    const { data , error } = await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`,
        to: email,
        subject: `Welcome to Chat-Application`,
        html: createWelcomeEmailTemplate(name, clientURL)
    })

    if(error){
        console.error('Error in sendWelcome Email', error.message);
        throw new Error('Failed to send welcome Email')
    }
    console.log('Welcome email sent successfully',data);
}