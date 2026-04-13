const { Resend } = require('resend')

const resend = new Resend(process.env.RESEND_API_KEY)

const sendVerificationEmail = async (email, token) => {
    try {
        const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`

        const response = await resend.emails.send({
            from: 'SkitPay <onboarding@resend.dev>',
            to: process.env.NODE_ENV === 'production' 
                ? email 
                : 'olufade.toheeb@gmail.com',
            subject: 'Verify your SkitPay account',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #7c3aed;">Welcome to SkitPay! 🎬</h1>
                    <p>Thanks for signing up! Please verify your email address to get started.</p>
                    <a href="${verificationUrl}" 
                    style="background: #7c3aed; color: white; padding: 12px 24px; 
                            border-radius: 8px; text-decoration: none; display: inline-block; margin: 20px 0;">
                        Verify Email
                    </a>
                    <p style="color: #6b7280;">This link expires in 24 hours.</p>
                    <p style="color: #6b7280;">If you didn't create an account, ignore this email.</p>
                </div>
            `
        })

        if (response.error) {
            console.log('Email error:', response.error)
            return false
        }
        return true
    } catch (error) {
        console.log('Email error:', error)
        return false
    }    
}

module.exports = { sendVerificationEmail }