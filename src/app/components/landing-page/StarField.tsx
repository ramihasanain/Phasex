export const StartField = () => {
    return <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {stars.map(s => (
            <motion.div key={s.id} className="absolute rounded-full bg-white"
                style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
                animate={{ opacity: [s.opacity * 0.3, s.opacity, s.opacity * 0.3], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: s.twinkle, repeat: Infinity, delay: s.delay, ease: "easeInOut" }} />
        ))}
    </div>
}