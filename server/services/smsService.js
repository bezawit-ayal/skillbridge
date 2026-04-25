const twilio = require('twilio');

class SMSService {
    constructor() {
        // Initialize Twilio client if credentials are provided in .env
        this.isMock = !process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN;
        
        if (!this.isMock) {
            try {
                this.client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
                this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
            } catch (error) {
                console.error('Failed to initialize Twilio. Falling back to mock SMS service.');
                this.isMock = true;
            }
        }
    }

    async sendEmergencySMS(toNumbers, emergencyData) {
        const { userName, location, status } = emergencyData;
        const mapsLink = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
        
        const messageBody = `
🚨 EMERGENCY ALERT 🚨
User ${userName} is in danger!
Location: ${mapsLink}
Time: NOW
Status: ${status || 'HIGH RISK'}
Action required immediately.
`.trim();

        // Ensure toNumbers is an array
        const numbers = Array.isArray(toNumbers) ? toNumbers : [toNumbers];

        const sendPromises = numbers.map(async (number) => {
            if (this.isMock) {
                // Mock execution for development/testing without real credentials
                console.log(`\n================= [MOCK SMS DISPATCH] =================`);
                console.log(`TO: ${number}`);
                console.log(`BODY:\n${messageBody}`);
                console.log(`=======================================================\n`);
                return Promise.resolve({ success: true, mock: true, to: number });
            } else {
                // Real Twilio execution
                try {
                    const message = await this.client.messages.create({
                        body: messageBody,
                        from: this.fromNumber,
                        to: number
                    });
                    console.log(`✅ SMS sent successfully to ${number}. SID: ${message.sid}`);
                    return { success: true, to: number, sid: message.sid };
                } catch (error) {
                    console.error(`❌ Failed to send SMS to ${number}:`, error.message);
                    return { success: false, to: number, error: error.message };
                }
            }
        });

        // Parallel execution for FAST delivery
        return Promise.all(sendPromises);
    }
}

module.exports = new SMSService();
