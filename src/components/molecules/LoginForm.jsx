import React, { useState } from 'react';
import Input from '../atoms/Input';
import Button from '../atoms/Button';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login data:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Ingresa tu email"
      />
      <Input
        label="Contraseña"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Ingresa tu contraseña"
      />
      <Button variant="primary" type="submit">
        Iniciar sesión
      </Button>
    </form>
  );
};

export default LoginForm;