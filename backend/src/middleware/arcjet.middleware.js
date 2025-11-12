import { isSpoofedBot } from "@arcjet/inspect";
import aj from "../config/arcjet.js";

export const arcjetProtection = async (req ,res, next) => {
    try {
        const decision = await aj.protect(req);

        if(decision.isDenied()){
            if(decision.reason.isRateLimit()){
                return res.status(429).json({message: "Rate limit exceeded. Please try again later."})
            } else if (decision.reason.isBot()){
                return res.status(403).json({message: "Bot access denied"})
            } else {
                return res.status(403).json({message: "Access denied by security policy"})
            }
        }

        if(decision.results.some(isSpoofedBot)){
            return res.status(403).json({
                error: "spoofedBot detected",
                message: "Malicious activity detected"
            })
        }

        next()
    } catch (error) {
        console.error('ArcjetProtection error',error.message);
        res.status(500).json({message: "Internal server error"})
        next()
    }
}