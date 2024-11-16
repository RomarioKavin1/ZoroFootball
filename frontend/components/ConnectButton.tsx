// components/ConnectButton.tsx
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";

export const ConnectCorner = () => {
  const CustomConnectButton = () => (
    <button
      className={`
        relative group
        transform transition-all duration-200
        px-6 py-2
      `}
    >
      {/* Background with pixel corners */}
      <div
        className={`
          absolute inset-0 bg-purple-600
          transition-all duration-200
          group-hover:bg-purple-500
          group-active:bg-purple-700
        `}
        style={{
          clipPath: `polygon(
            0 4px, 4px 4px, 4px 0,
            calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px,
            100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) 100%,
            4px 100%, 4px calc(100% - 4px), 0 calc(100% - 4px)
          )`,
        }}
      />

      {/* Border Glow Effect */}
      <div
        className="absolute inset-0 opacity-50 group-hover:opacity-75 transition-opacity"
        style={{
          background:
            "linear-gradient(45deg, rgba(168, 85, 247, 0.4), rgba(236, 72, 153, 0.4))",
          clipPath: `polygon(
            0 4px, 4px 4px, 4px 0,
            calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px,
            100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) 100%,
            4px 100%, 4px calc(100% - 4px), 0 calc(100% - 4px)
          )`,
        }}
      />

      {/* Text */}
      <span
        className={`
          relative block
          text-lg font-bold 
          text-white
          tracking-wider
          transition-all duration-200
          group-hover:transform
          group-hover:-translate-y-0.5
          group-active:translate-y-0.5
        `}
      >
        CONNECT WALLET
      </span>

      {/* Pixel Corner Decorations */}
      <div className="absolute w-1 h-1 bg-purple-300 top-1 left-1" />
      <div className="absolute w-1 h-1 bg-purple-300 top-1 right-1" />
      <div className="absolute w-1 h-1 bg-purple-300 bottom-1 left-1" />
      <div className="absolute w-1 h-1 bg-purple-300 bottom-1 right-1" />
    </button>
  );

  return (
    <div className="absolute top-4 right-4 z-50">
      <div className="transform transition-opacity duration-300 hover:opacity-90">
        <DynamicWidget innerButtonComponent={<CustomConnectButton />} />
      </div>
    </div>
  );
};
