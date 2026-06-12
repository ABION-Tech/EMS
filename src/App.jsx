import ObserverApp from "./observer-app";
import Dashboard from "./dashboard";

export default function App() {
  const path = window.location.pathname;
  if (path === "/dashboard") return <Dashboard />;
  return <ObserverApp />;
}