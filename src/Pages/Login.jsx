import Header from "../components/Header";
import Footer from "../components/Footer";
import LoginRegister from "../components/LoginRegister";


function Login(){
    
    return (
    <div style={{ minHeight: '100vh' }}>
        <Header />
        <LoginRegister/>
        <Footer />
    </div>
    );
    
    
    
}

export default Login;