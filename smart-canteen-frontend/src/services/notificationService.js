export const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
        console.log('This browser does not support notifications.');
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    return false;
};

export const sendNotification = (title, options = {}) => {
    if (Notification.permission === 'granted') {
        try {
            const notification = new Notification(title, {
                icon: 'https://cdn-icons-png.flaticon.com/512/3565/3565418.png', // Premium food icon
                badge: 'https://cdn-icons-png.flaticon.com/512/3565/3565418.png',
                ...options,
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
            };
        } catch (error) {
            console.error('Error showing notification:', error);
        }
    } else {
        console.log('Notification permission not granted. Status:', Notification.permission);
    }
};
