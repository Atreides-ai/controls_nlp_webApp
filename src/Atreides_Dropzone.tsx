import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import 'fontsource-roboto';
import { Typography, Grid, Divider, Container } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

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
                <Grid container direction="column" alignItems="center" justify="center">
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Container>
                            <CloudUploadIcon color="secondary" style={{ fontSize: 200 }} />
                        </Container>
                        <Divider></Divider>
                    </Grid>
                </Grid>
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
