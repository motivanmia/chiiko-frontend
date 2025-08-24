const { VITE_API_BASE } = import.meta.env;

const url = {
  user: `${VITE_API_BASE}/users`,
  cart: `${VITE_API_BASE}/cart`,
  member: `${VITE_API_BASE}/member`,
  order: `${VITE_API_BASE}/order`,
  recipe: `${VITE_API_BASE}/recipe`,
  school: `${VITE_API_BASE}/school`,
  product: `${VITE_API_BASE}/product`,
};

export default url;
