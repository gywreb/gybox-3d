import { triggerBase64Download } from "react-base64-downloader";
import React from "react";
import Button from "../../common/Button/Button";
import { DEFAULT_EXPORT_NAME, EXPORT_FORMATS } from "../../constants/constants";
import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";
import { SVGRenderer } from "three/examples/jsm/renderers/SVGRenderer";

const BoxExporter = ({
  cameraRef,
  sceneRef,
  canvasRef,
  downloadFormat,
  exportName = DEFAULT_EXPORT_NAME,
}) => {
  const handleDownloadBox = () => {
    if (canvasRef.current) {
      const renderedBox = canvasRef.current.toDataURL(
        downloadFormat === EXPORT_FORMATS.PDF
          ? EXPORT_FORMATS.JPEG
          : downloadFormat
      );
      switch (downloadFormat) {
        case EXPORT_FORMATS.PDF: {
          const pdf = new jsPDF();
          pdf.addImage(renderedBox, "JPEG", 0, 0);
          pdf.save(exportName);
          break;
        }
        case EXPORT_FORMATS.SVG: {
          const rendererSvg = new SVGRenderer();
          rendererSvg.setSize(window.innerWidth, window.innerHeight);
          rendererSvg.render(sceneRef.current, cameraRef.current);

          const XMLS = new XMLSerializer();
          const svgfile = XMLS.serializeToString(rendererSvg.domElement);
          const svgData = svgfile;
          const preface = '<?xml version="1.0" standalone="no"?>\r\n';
          const svgBlob = new Blob([preface, svgData], {
            type: "image/svg+xml;charset=utf-8",
          });
          saveAs(svgBlob, `${exportName}.svg`);
          break;
        }
        default: {
          triggerBase64Download(renderedBox, exportName);
          break;
        }
      }
    }
  };
  return (
    <Button
      onClick={handleDownloadBox}
      className="text-white bg-purple-500 p-2 mt-3 w-full flex items-start justify-center rounded-md"
    >
      Download Now
    </Button>
  );
};

export default BoxExporter;
