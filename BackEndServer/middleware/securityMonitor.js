const logger = require('../utils/logger');

const failureTracker = new Map();
const THRESHOLD = 5; 

const securityMonitor = {
    trackFailedLogin: (ip) => {
        const count = (failureTracker.get(ip) || 0) + 1;
        failureTracker.set(ip, count);

        if (count >= THRESHOLD) {
            logger.error('SECURITY_ALERT: THRESHOLD_EXCEEDED', {
                event: 'Multiple Failed Logins',
                ip: ip,
                attempts: count,
                severity: 'CRITICAL',
                action: 'Consider temporary IP block'
            });
        }
        
        // Reset counter after 15 minutes to avoid permanent bans
        setTimeout(() => failureTracker.delete(ip), 15 * 60 * 1000);
    }
};

module.exports = securityMonitor;