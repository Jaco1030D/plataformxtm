import { AlertCircle, CheckCircle, Clock, Edit3 } from "lucide-react";
import { useFunctions } from "./useFunctions";
import type { MigratedSegment } from "../../../context/FileUploads/types/context";


const HeaderSegments = ({segment}: {segment: MigratedSegment}) => {
    const {getStatusColor} = useFunctions()

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <CheckCircle className="w-4 h-4" />;
            case 'translated':
                return <CheckCircle className="w-4 h-4" />;
            case 'review':
                return <AlertCircle className="w-4 h-4" />;
            case 'new':
                return <Clock className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    return (
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
                {/* Numeração */}
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 text-sm font-bold rounded-full">
                    {segment.id}
                </div>
                
                {/* Status */}
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(segment.status)}`}>
                    {getStatusIcon(segment.status)}
                    <span className="ml-1 capitalize">{segment.status}</span>
                </span>
            </div>

            {/* Lock Status */}
            {segment.changed && (
                <div className="flex items-center justify-end mb-3">
                    <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        <Edit3 className="w-4 h-4" />
                        <span>Alterado</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeaderSegments;