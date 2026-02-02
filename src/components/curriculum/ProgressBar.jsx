export default function ProgressBar({ progress }) {
    // Ensure progress is between 0 and 100
    const clampedProgress = Math.min(Math.max(progress, 0), 100);

    return (
        <div className="w-full">
            <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-myora-700">Course Progress</span>
                <span className="text-sm font-medium text-myora-700">{Math.round(clampedProgress)}%</span>
            </div>
            <div
                className="w-full bg-gray-200 rounded-full h-2.5"
                role="progressbar"
                aria-valuenow={clampedProgress}
                aria-valuemin="0"
                aria-valuemax="100"
            >
                <div
                    className="bg-myora-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${clampedProgress}%` }}
                ></div>
            </div>
        </div>
    );
}
