import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const AtreidesDropzone = (): JSX.Element => {
    const maxSize = 1048576;

    const onDrop = useCallback(acceptedFiles => {
        console.log(acceptedFiles);
    }, []);

    const { isDragActive, getRootProps, getInputProps, isDragReject, acceptedFiles, rejectedFiles } = useDropzone({
        onDrop,
        accept: '.xslx, .xls, .csv',
        minSize: 0,
        maxSize,
    });

    const isFileTooLarge = rejectedFiles.length > 0 && rejectedFiles[0].size > maxSize;

    return (
        <div>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                {!isDragActive && 'Click here or drop a file to upload!'}
                {isDragActive && !isDragReject && "Drop it like it's hot!"}
                {isDragReject && 'File type not accepted, sorry!'}
                {isFileTooLarge && <div>File is too large.</div>}
            </div>
            <ul>
                {acceptedFiles.length > 0 &&
                    acceptedFiles.map((acceptedFile: { name: React.ReactNode }) => (
                        <li key={name}>{acceptedFile.name}</li>
                    ))}
            </ul>
        </div>
    );
};

export default AtreidesDropzone;
