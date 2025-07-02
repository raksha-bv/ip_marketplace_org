import React, { useContext } from 'react';
import RegisterIP from '../components/RegisterIP';

export default function Register() {
  
  const handleRegister = async () => {
    const registry = createRegistryActor("your-canister-id", identity);
    await registry.register_ip_asset(form.title, form.ipType, form.jurisdiction, form.licenseType, form.description, hash(form.document), form.termsUrl);
  };
  return (
    <div>
      <RegisterIP onSubmit={handleRegister} />
    </div>
  );
}
