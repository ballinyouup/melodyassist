interface IDivider {
  mobileHide?: boolean;
}

const Divider: React.FC<IDivider> = ({ mobileHide }) => {
  return (
    <div className="flex flex-row justify-center">
      <div
        className={`divider m-4 h-8 w-full max-w-sm before:h-[0.05rem] before:bg-black before:bg-opacity-25 after:h-[0.05rem] after:bg-black after:bg-opacity-25 md:max-w-xl ${
          mobileHide ? "hidden md:flex" : ""
        }`}
      />
    </div>
  );
};

export default Divider;
