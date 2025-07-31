export default function Hero() {
  return (
    <div className="flex-col gap-y-16 flex max-w-[500px] mx-auto items-center justify-center text-center">
      <h1 className="text-[36px] xs:text-[42px] md:text-[48px] leading-[135%] md:leading-[125%] font-medium text-sys-color-text-primary">
        Embed BTC Utility{" "}
        <span className="inline-flex items-center gap-x-8 md:gap-x-16">
          with
          <img
            src="/graphics/plug.png"
            alt="Plug"
            className="h-[42px] md:h-[58px] w-[42px] md:w-[58px] flash-in opacity-0"
          ></img>
          <span className="zeus-stack-title flash-in opacity-0 bg-clip-text text-transparent [background-image:linear-gradient(85.6deg,#FFFFFF_5.26%,#ECE0FF_30.69%,#FEE0FF_48.39%,#FFEFE0_65.35%,#FFFAE0_78.62%)]">
            ZeusStack
          </span>
        </span>
      </h1>
      <p className="body-body1-medium">
        Instantly add tokenized Bitcoin flows to any website or app—no code, no
        friction.
      </p>
    </div>
  );
}
