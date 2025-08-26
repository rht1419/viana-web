import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'components/ui/Button';

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/birthday-countdown-landing-page');
  };

  return (
    <div className="mb-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBack}
        iconName="ArrowLeft"
        iconPosition="left"
        iconSize={18}
        className="text-text-secondary hover:text-primary transition-magical"
      >
        Back to Countdown
      </Button>
    </div>
  );
};

export default BackButton;