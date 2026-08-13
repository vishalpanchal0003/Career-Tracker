

const LoadingState = () => {
    return (
        <div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((item) => (
                    <div
                        key={item}
                        className="h-32 animate-pulse rounded-2xl bg-white/10"
                    />
                ))}
            </div>
        </div>
    )
}

export default LoadingState