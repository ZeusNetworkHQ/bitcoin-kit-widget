import { Variant } from "./Icon";

/**
 * A hidden provider that ensures all icon SVG definitions are available in the DOM.
 * This component renders all icon variants invisibly to prevent SVG rendering issues
 * where icons with <defs> and <use> elements might appear as black squares if their
 * definitions aren't loaded as the first reference.
 *
 * By pre-rendering all icons in a hidden container, we guarantee that SVG definitions
 * are available throughout the application lifecycle.
 */

function IconProvider() {
  return (
    <div
      id="zeus-icons-provider"
      className="zeus:h-0 zeus:w-0 zeus:overflow-clip"
    >
      {Object.entries(Variant).map(([key, Icon]) => (
        <Icon key={key} />
      ))}
    </div>
  );
}

export default IconProvider;
