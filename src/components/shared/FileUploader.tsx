import React, { useCallback, useState } from 'react'
import { useDropzone, FileWithPath } from 'react-dropzone'
import { Button } from '../ui/button'

type FileUploaderProps = {
    fieldChange: (files: File[]) => void;
    mediaUrl: string;
}

const FileUploader = ({ fieldChange, mediaUrl } : FileUploaderProps ) => {

    const [file, setfile] = useState<File[]>([]);
    const [fileUrl, setfileUrl] = useState('')

    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        // Do something with the files
        setfile(acceptedFiles);
        fieldChange(acceptedFiles);
        setfileUrl(URL.createObjectURL(acceptedFiles[0]));
    }, [file])

    const { getRootProps, getInputProps } = useDropzone({ onDrop,
        accept: {
            "image/*": [".png", ".jpeg", ".jpg", ".svg"]
        }
    })

    return (
        <div {...getRootProps()} className='flex flex-center flex-col bg-dark-3 roudned-xl cursor-pointer'>
            <input {...getInputProps()} className='cursor-pointer' />
            {
                fileUrl ? (
                    <>
                    <div className="flex flex-1 w-full justify-center p-5 lg:p-10">
                        <img src={fileUrl} alt="Image" className="file_uploader-img" />
                    </div>
                        <p className='file_uploader-label'>Click or Drag Photo to Replace</p>
                    </>
                ) : (
                    <div className="file_uploader-box">
                        <img src="/assets/icons/file-upload.svg" width={96} height={77} alt="file upload" />
                        <h3 className="base-medium text-light-2 mb-2 mt-6">Drag Photo Here</h3>
                        <p className="text-light-4 small-regular mb-6">SVG, PNG, JPG</p>
                        <p className="base-medium small-regular mb-4 ">or</p>
                        <Button className='shad-button_dark_4'>Select from Computer</Button>
                    </div>
                )
                    
            }
        </div>
    )
}

export default FileUploader