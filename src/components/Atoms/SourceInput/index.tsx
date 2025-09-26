import React from "react";

const SourceInput = React.memo(({text}:{text: string}) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Texto Original (Source)
            </label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{__html: text}} />
            </div>
        </div>
    );
})

export default SourceInput;