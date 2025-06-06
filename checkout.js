document.addEventListener('DOMContentLoaded', () => {
    const recvForm = document.querySelector('.recv-form');
    let successMsgDiv = null;

    // Handle form submit
    recvForm.addEventListener('submit', (e) => {
        e.preventDefault(); // prevent actual form submission

        // Create overlay
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '1000'
        });

        // Create popup box
        const popup = document.createElement('div');
        Object.assign(popup.style, {
            background: '#fff',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            textAlign: 'center',
            maxWidth: '320px',
            margin: '0 1rem'
        });

        // Message text
        const message = document.createElement('p');
        message.textContent = 'Receiver Info Saved successfully!';
        Object.assign(message.style, {
            marginBottom: '1.5rem',
            color: '#333',
            fontSize: '1rem',
            lineHeight: '1.4'
        });

        // OK button
        const okBtn = document.createElement('button');
        okBtn.textContent = 'OK';
        Object.assign(okBtn.style, {
            padding: '0.5rem 1rem',
            backgroundColor: '#2a7cff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem'
        });

        okBtn.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });

        popup.appendChild(message);
        popup.appendChild(okBtn);
        overlay.appendChild(popup);
        document.body.appendChild(overlay);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const payButton = document.querySelector('.pay-btn');

    payButton.addEventListener('click', (e) => {
        e.preventDefault(); // prevent actual form submission

        // Create overlay
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '1000'
        });

        // Create popup box
        const popup = document.createElement('div');
        Object.assign(popup.style, {
            background: '#fff',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            textAlign: 'center',
            maxWidth: '320px',
            margin: '0 1rem'
        });

        // Message text
        const message = document.createElement('p');
        message.textContent = 'Thank you for the Purchase. You will receive the confirmation soon.';
        Object.assign(message.style, {
            marginBottom: '1.5rem',
            color: '#333',
            fontSize: '1rem',
            lineHeight: '1.4'
        });

        // OK button
        const okBtn = document.createElement('button');
        okBtn.textContent = 'OK';
        Object.assign(okBtn.style, {
            padding: '0.5rem 1rem',
            backgroundColor: '#2a7cff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem'
        });

        okBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });

        popup.appendChild(message);
        popup.appendChild(okBtn);
        overlay.appendChild(popup);
        document.body.appendChild(overlay);
    });

});