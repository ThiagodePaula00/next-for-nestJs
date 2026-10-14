type SpinLoaderProps = {
    className?: string
}

export function SpinLoader({className = ''}: SpinLoaderProps) {
    const classes = `flex items-center justify-center ${className}`.trim();

    return (
    <div className={classes}>
        <div className="w-10 h-10 border-5 border-t-transparent border-slate-900 rounded-full animate-spin">

        </div>
    </div>
  );
}