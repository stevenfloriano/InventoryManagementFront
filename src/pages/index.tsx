import { useState, useEffect } from "react";
import { addToast, Form, Input, Button } from "@heroui/react";
import { EyeSlashFilledIcon, EyeFilledIcon } from "@/components/icons";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../axios";
import { calculateDatesDifference } from "@/utils/dates";

const initialToken = {
  dateCreated: null,
  token: undefined
};

const secretKey = import.meta.env.VITE_HANDSHAKE_SECRET;

export default function LoginPage() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      navigate("/home");
    }
  }, [navigate]);

  const toggleVisibility = () => setIsVisible(!isVisible);
  
    const refreshToken = async () => {
    const token = sessionStorage.getItem('Token');
    const tokenData = JSON.parse(token ? token : JSON.stringify(initialToken));

    const tokenRequest = {
      token: tokenData.token,
      secretKey
    };

    const tokenResponse = await axiosClient.post(`/JWTSecurity/RefreshToken`, tokenRequest);
    const newTokenData = {
      token: tokenResponse.data,
      dateCreated: new Date()
    };

    sessionStorage.setItem('Token', JSON.stringify(newTokenData));
  };

  const generateToken = async () => {
    const tokenResponse = await axiosClient.post(`/JWTSecurity/GenerateToken`, { secretKey });
    const newTokenData = {
      token: tokenResponse.data,
      dateCreated: new Date()
    };

    sessionStorage.setItem('Token', JSON.stringify(newTokenData));
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();

    const formData = Object.fromEntries(new FormData(e.currentTarget));
    const email = formData.email as string;
    const password = formData.password as string;

    const payload = { email, password };

    try {
      const token = sessionStorage.getItem('Token');
      const tokenData = JSON.parse(token ? token : JSON.stringify(initialToken));
      
      if (tokenData.dateCreated) {
        const tokenDate = new Date(tokenData.dateCreated);
        const now = new Date();

        const minutesDifference = calculateDatesDifference(now, tokenDate, 'minutes');

        if (minutesDifference >= 1380) {
          await refreshToken();
        } else {
          await generateToken();
        }
      } else {
        await generateToken();
      }

      const loginResponse = await axiosClient.post("/Auth/login", payload);

      if (loginResponse.status === 200) {
        sessionStorage.setItem("user", email);
        navigate("/home");
      } else {
        addToast({ title: "Usuario o clave errada ", color: "danger" });
      }
    } catch (error: any) {
      console.error(error);
      addToast({ title: "Usuario o clave errada", color: "danger" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black transition-colors">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-2xl p-8 w-full max-w-md">
        
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Inventory
        </h1>

        <Form
          className="space-y-4"
          onReset={() => setSubmitted(null)}
          onSubmit={onSubmit}
        >
          <Input
            isRequired
            errorMessage={({ validationDetails }) => {
              if (validationDetails.valueMissing) {
                return "Por favor, ingrese su correo";
              }
              if (validationDetails.typeMismatch) {
                return "Ingrese un correo válido";
              }
            }}
            label="Email"
            labelPlacement="inside"
            name="email"
            placeholder="Ingrese su email"
            type="email"
          />

          <Input
            isRequired
            errorMessage={({ validationDetails }) => {
              if (validationDetails.valueMissing) {
                return "Por favor, ingrese su clave";
              }
            }}
            label="Clave"
            labelPlacement="inside"
            name="password"
            placeholder="Ingrese su clave"
            type={isVisible ? "text" : "password"}
            endContent={
              <button
                aria-label="toggle password visibility"
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            value={password}
            onValueChange={setPassword}
          />

          <div className="w-full">
            <Button className="w-full" color="primary" type="submit">
              Ingresar
            </Button>
          </div>

          {submitted && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Submitted data: <pre>{JSON.stringify(submitted, null, 2)}</pre>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
}
