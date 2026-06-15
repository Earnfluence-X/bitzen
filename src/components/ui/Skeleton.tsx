export function SkeletonLine({ width = '100%', height = 16 }: { width?: string; height?: number }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: 8 }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div
      style={{
        background: '#0b0e14',
        border: '1px solid #1a1f2c',
        borderRadius: 18,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <SkeletonLine width="60%" height={14} />
      <SkeletonLine width="100%" height={12} />
      <SkeletonLine width="40%" height={12} />
    </div>
  );
}
