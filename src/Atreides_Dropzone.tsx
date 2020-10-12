import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Paper from '@material-ui/core/Paper';
import AtreidesLogo from './AtreidesLogo';
import 'fontsource-roboto';
import { Typography } from '@material-ui/core';
import AtreidesIcon from './AtreidesIcon';

const AtreidesDropzone = (props: { handleFiles: (files: Array<File>) => Promise<void> }): JSX.Element => {
    const maxSize = 1048576;

    const onDrop = useCallback(acceptedFiles => {
        props.handleFiles(acceptedFiles);
    }, []);

    const { isDragActive, getRootProps, getInputProps, isDragReject, acceptedFiles, rejectedFiles } = useDropzone({
        onDrop,
        accept: 'text/csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
        minSize: 0,
        maxSize,
    });

    const isFileTooLarge = rejectedFiles.length > 0 && rejectedFiles[0].size > maxSize;

    return (
        <div>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <AtreidesIcon></AtreidesIcon>
                <AtreidesLogo></AtreidesLogo>
                <Typography variant="h6" align="center">
                    {!isDragActive && 'Click here or drop a file to upload.'}
                    {isDragActive && !isDragReject && 'Drop the file Please!'}
                    {isDragReject && 'File type not accepted, sorry!'}
                </Typography>
                {isFileTooLarge && <Typography variant="caption">File is too large.</Typography>}
            </div>
            <ul>
                {acceptedFiles.length > 0 &&
                    // eslint-disable-next-line react/jsx-key
                    acceptedFiles.map((acceptedFile: { name: React.ReactNode }) => (
                        // eslint-disable-next-line react/jsx-key
                        <li>
                            <Typography variant="overline">{acceptedFile.name}</Typography>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default AtreidesDropzone;
