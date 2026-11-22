import React, { useState, useEffect } from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { getSettings } from '../services/api';

const WhatsAppButton = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    getSettings()
      .then(setSettings)
      .catch((err) => console.log('WhatsApp button error:', err));
  }, []);

  const whatsappNum = (settings?.whatsapp_number || '+11234567890').replace(/[^0-9]/g, '');
  const phoneNum = settings?.contact_number || '+1 (123) 456-7890';
  const prefilledText = encodeURIComponent("Hello Warrior Martial Arts! I would like to enquire about martial arts classes and book a free trial.");

  return (
    <div className="floating-actions">
      {/* Direct Call Button */}
      <a
        href={`tel:${phoneNum}`}
        className="floating-btn phone"
        aria-label="Direct Call"
        title="Call Academy Directly"
      >
        <Phone size={24} />
        <span className="floating-tooltip">Call: {phoneNum}</span>
      </a>

      {/* WhatsApp Floating Button */}
      <a
        href={`https://wa.me/${whatsappNum}?text=${prefilledText}`}
        target="_blank"
        rel="noreferrer"
        className="floating-btn whatsapp"
        aria-label="WhatsApp Enquiry"
        title="Chat on WhatsApp"
      >
        <MessageCircle size={26} />
        <span className="floating-tooltip">Chat on WhatsApp</span>
      </a>
    </div>
  );
};

export default WhatsAppButton;
