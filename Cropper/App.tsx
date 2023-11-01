import React, { useCallback, useRef, useState } from "react";
import { Button, Spin, Upload } from "antd";
import {
  ArrowLeftOutlined,
  CheckOutlined,
  DownloadOutlined,
  PlusOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import Cropper, { CropperState, CropperRef } from "react-document-crop";
import "./App.css";

const { Dragger } = Upload;

const App: React.FC = () => {
  const [cropState, setCropState] = useState<CropperState>();
  const [img, setImg] = useState<any>();
  const [croppedImg, setCroppedImg] = useState<any>();
  const cropperRef = useRef<CropperRef>();

  const onDragStop = useCallback((s: CropperState) => setCropState(s), []);
  const onChange = useCallback((s: CropperState) => setCropState(s), []);

  const doSomething = () => {
    cropperRef.current?.done({
        preview: true,
      })
      .then((blob: any) => {
        setCroppedImg(blob);
      })
      .catch(console.error);
  };

  const onImgSelection = async (e: any) => {
    if (e.fileList && e.fileList.length > 0) {
      // it can also be a http or base64 string for example
      setImg(e.fileList[0].originFileObj);
    }
  };

  const draggerProps = {
    name: "file",
    multiple: false,
    onChange: onImgSelection,
    accept: "image/*",
  };

  return (
    <div className="root-container">
      <div className="content-container">
        {img && cropState?.loading === false && (
          <div className="buttons-container">
            {croppedImg ? (
              <>
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={() => {
                    cropperRef.current?.backToCrop();
                    setCroppedImg(undefined);
                  }}
                >
                  Retour
                </Button>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={() => {
                    const link = document.createElement("a");
                    link.download = img.name;
                    link.href = URL.createObjectURL(croppedImg);
                    link.click();
                  }}
                >
                  Télécharger
                </Button>
              </>
            ) : (
              <>
                <Button onClick={doSomething} icon={<CheckOutlined />}>
                  Terminé
                </Button>
                <Button
                  icon={<RotateLeftOutlined />}
                  onClick={() => {
                    cropperRef.current?.rotate(270);
                  }}
                >
                  Rotater vers la gauche
                </Button>
                <Button
                  icon={<RotateRightOutlined />}
                  onClick={() => {
                    cropperRef.current?.rotate(90);
                  }}
                >
                  Rotater vers la droite
                </Button>
                <Button
                  onClick={() => {
                    cropperRef.current?.mirror(true);
                  }}
                >
                  Retourner à l'horizontal
                </Button>
                <Button
                  onClick={() => {
                    cropperRef.current?.mirror(false);
                  }}
                >
                  Retourner à la vertical
                </Button>
              </>
            )}
            <Button
              icon={<SyncOutlined />}
              onClick={() => {
                setImg(undefined);
                setCroppedImg(undefined);
              }}
            >
              Réinitialiser
            </Button>
          </div>
        )}
        {img && (
          <Cropper
            // @ts-ignore
            ref={cropperRef}
            image={img}
            onChange={onChange}
            onDragStop={onDragStop}
            maxWidth={window.innerWidth - 10}
            openCvPath="opencv.js"
          />
        )}
        {cropState?.loading && <Spin />}
        {!img && (
          <Dragger {...draggerProps}>
            <p>
              <PlusOutlined />
            </p>
            <p>Téléverser</p>
          </Dragger>
        )}
      </div>
    </div>
  );
};

export default App;
