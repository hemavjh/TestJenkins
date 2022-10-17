using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.Livebox.Models
{
    //public class LiveboxModel
    //{
    //    public Int32 Duration { get; set; }
    //    public Guid ConferenceId { get; set; }

    //}

    public class GetAppointmentDuration
    {
        long AppointmentDuration { get; set; }
        long ConferenceId { get; set; }
    }
}