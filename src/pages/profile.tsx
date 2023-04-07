import Layout from "./Layout";

function Profile() {
  return (
    <div className="relative h-screen">
      <span className="absolute top-1/3 left-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center bg-black p-20 text-3xl font-medium text-white md:w-1/2">
        <p>🛠️ Profile Page</p>
        <p>Coming Soon 🛠️</p>
      </span>
    </div>
  );
}

export default Layout(Profile);
