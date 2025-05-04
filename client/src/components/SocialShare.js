import React, { useState } from 'react';
import { Button, OverlayTrigger, Tooltip, Modal } from 'react-bootstrap';
import {
  FaFacebook,
  FaTwitter,
  FaWhatsapp,
  FaPinterest,
  FaEnvelope,
  FaLink,
  FaShareAlt
} from 'react-icons/fa';

const SocialShare = ({ url, title, image, description }) => {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Encode parameters for sharing
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedImage = image ? encodeURIComponent(image) : '';
  const encodedDescription = encodeURIComponent(description || '');
  
  // Share URLs
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
  const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImage}&description=${encodedTitle}`;
  const emailUrl = `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`;
  
  const handleShare = (shareUrl) => {
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  return (
    <>
      <Button
        variant="outline-secondary"
        className="d-flex align-items-center"
        onClick={() => setShowModal(true)}
      >
        <FaShareAlt className="me-2" /> Share
      </Button>
      
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="sm"
      >
        <Modal.Header closeButton>
          <Modal.Title>Share This Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-wrap justify-content-center">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Share on Facebook</Tooltip>}
            >
              <Button
                variant="outline-primary"
                className="m-1"
                onClick={() => handleShare(facebookUrl)}
              >
                <FaFacebook size={24} />
              </Button>
            </OverlayTrigger>
            
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Share on Twitter</Tooltip>}
            >
              <Button
                variant="outline-info"
                className="m-1"
                onClick={() => handleShare(twitterUrl)}
              >
                <FaTwitter size={24} />
              </Button>
            </OverlayTrigger>
            
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Share on WhatsApp</Tooltip>}
            >
              <Button
                variant="outline-success"
                className="m-1"
                onClick={() => handleShare(whatsappUrl)}
              >
                <FaWhatsapp size={24} />
              </Button>
            </OverlayTrigger>
            
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Share on Pinterest</Tooltip>}
            >
              <Button
                variant="outline-danger"
                className="m-1"
                onClick={() => handleShare(pinterestUrl)}
              >
                <FaPinterest size={24} />
              </Button>
            </OverlayTrigger>
            
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Share via Email</Tooltip>}
            >
              <Button
                variant="outline-secondary"
                className="m-1"
                onClick={() => handleShare(emailUrl)}
              >
                <FaEnvelope size={24} />
              </Button>
            </OverlayTrigger>
            
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>{copied ? 'Copied!' : 'Copy Link'}</Tooltip>}
            >
              <Button
                variant={copied ? "success" : "outline-dark"}
                className="m-1"
                onClick={copyToClipboard}
              >
                <FaLink size={24} />
              </Button>
            </OverlayTrigger>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SocialShare;
