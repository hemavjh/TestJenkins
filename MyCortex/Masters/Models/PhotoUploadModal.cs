using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.Masters.Models
{
    public class PhotoUploadModal
    {
        public long Id { get; set; }
        public Byte[] PhotoBlob { get; set; }
        public Byte[] NationalPhotoBlob { get; set; }
        public Byte[] InsurancePhotoBlob { get; set; }
        public Byte[] CertificateBlob { get; set; }
        public string FileName { get; set; }
    }
}