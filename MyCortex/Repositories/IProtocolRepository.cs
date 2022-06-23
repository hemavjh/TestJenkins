using MyCortex.Admin.Controllers;
using MyCortex.Admin.Models;
using MyCortex.Masters.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.Repositories
{
    interface IProtocolRepository
    {
        IList<ProtocolModel> StandardProtocol_View(long Id);
        IList<ProtocolModel> StandardProtocol_AddEdit(ProtocolModel obj);
        IList<ProtocolModel> StandardProtocol_List(int IsActive, long InstitutionId);
        //void StandardProtocol_Delete(int Id);
        //void StandardProtocol_Active(int Id);
        IList<MonitoringProtocolModel> ProtocolMonitoring_AddEdit(MonitoringProtocolModel obj);
        IList<MonitoringProtocolModel> ProtocolMonitoring_AddEditNew(MonitoringProtocolNewModel obj);
        MonitoringProtocolModel ProtocolMonitoring_View(long Id);
        MonitoringProtocolNewModel ProtocolMonitoringNewView(long Id);
        IList<DurationModel> DurationTypeDetails();
        void ProtocolMonitoring_InActive(int Id);
        void ProtocolMonitoring_Active(int Id);
        void ProtocolMonitoring_Delete(int Id);
        IList<MonitoringProtocolModel> ProtocolNameDetails(long InstitutionId);
        IList<MonitoringProtocolModel> ParameterNameList(long InstitutionId);
    }
}