import Recipient from '../components/Recipient';
import Header from '../components/Header'; // Giả sử bạn có Header trong components
import Footer from '../components/Footer'; // Giả sử bạn có Footer trong components
function PaymentPage() {
  return (
    <div>
        <Header/>
        <Recipient/>
        <Footer/>
    </div>
  );
}

export default PaymentPage;
