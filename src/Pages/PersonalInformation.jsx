import React from 'react';
import Header from '../components/Header';
import PersonalInformation from '../components/PersonalInformation';
import Footer from '../components/Footer';

function PersonalInformationPage() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Header />
      <PersonalInformation />
      <Footer />
    </div>
  );
}

export default PersonalInformationPage;
