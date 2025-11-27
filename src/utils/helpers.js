export const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };
  
  export const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };