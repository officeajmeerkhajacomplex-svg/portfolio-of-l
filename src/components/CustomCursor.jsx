import SmoothCursor from './ui/SmoothCursor';

/**
 * App-level Magic UI SmoothCursor mount.
 * SmoothCursor portals its visual layer to body so it stays above route content.
 */
export default function CustomCursor() {
  return <SmoothCursor />;
}
