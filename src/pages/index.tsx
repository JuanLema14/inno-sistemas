import LoginForm from '@/components/frames/FormularioLogin/'
import LoginLayout from '@/components/layouts/LoginLayout';

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#CAE7F5] overflow-hidden">
      <div className="absolute w-[400px] h-[400px] bg-[#6D7AFD] rounded-full blur-[100px] opacity-70 top-[-100px] left-[-100px]" />
      <div className="absolute w-[300px] h-[300px] bg-[#888AF9] rounded-full blur-[100px] opacity-60 top-[100px] right-[100px]" />
      <div className="absolute w-[500px] h-[500px] bg-[#C6CDFB] rounded-full blur-[120px] opacity-60 bottom-[-150px] left-[50px]" />
      <div className="absolute w-[350px] h-[350px] bg-[#5597F8] rounded-full blur-[90px] opacity-60 bottom-[100px] right-[80px]" />

      <div className="relative z-10 w-full max-w-md p-8">
        <LoginForm />
      </div>
    </div>
  )
}

LoginPage.getLayout = function getLayout(page: React.ReactElement) {
  return <LoginLayout>{page}</LoginLayout>;
};