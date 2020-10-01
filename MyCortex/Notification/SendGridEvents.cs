using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace MyCortex.Email.SendGrid
{
    /*
    [{"email":"cc70@gmail.com","event":"processed","send_at":0,"sg_event_id":"cHJvY2Vzc2VkLTE1NTg0NjM1LWVkbVEwNnVNUU5LWVBBdjY2dXM5dWctMA",
        "sg_message_id":"edmQ06uMQNKYPAv66us9ug.filterdrecv-p3iad2-8ddf98858-mzxhd-20-5E96A76B-2.0",
        "smtp-id":"<edmQ06uMQNKYPAv66us9ug@ismtpd0001p1maa1.sendgrid.net>","timestamp":1586931563},

{"email":"cc70@gmail.com","event":"bounce","ip":"167.89.12.138", 
"reason":"550 5.1.1 The email account that you tried to reach does not exist. Please try double-checking the recipient's email address for typos or unnecessary spaces. Learn more at https://support.google.com/mail/?p=NoSuchUser hh22si9906882ejb.375 - gsmtp",
"sg_event_id":"Ym91bmNlLTAtMTU1ODQ2MzUtZWRtUTA2dU1RTktZUEF2NjZ1czl1Zy0w",
"sg_message_id":"edmQ06uMQNKYPAv66us9ug.filterdrecv-p3iad2-8ddf98858-mzxhd-20-5E96A76B-2.0",
"smtp-id":"<edmQ06uMQNKYPAv66us9ug@ismtpd0001p1maa1.sendgrid.net>","status":"5.1.1","timestamp":1586931564,"tls":1,"type":"bounce"}]

[{"email":"p70@gmail.com","event":"processed","send_at":0,"sg_event_id":"cHJvY2Vzc2VkLTE1NTg0NjM1LUNGbVR1U0ItVFctTHppY3BGT2FGV0EtMA",
"sg_message_id":"CFmTuSB-TW-LzicpFOaFWA.filterdrecv-p3iad2-8ddf98858-z54vx-21-5E96A76B-2C.0",
"smtp-id":"<CFmTuSB-TW-LzicpFOaFWA@ismtpd0008p1maa1.sendgrid.net>","timestamp":1586931564},

{"email":"p70@gmail.com","event":"bounce","ip":"167.89.24.164",
"reason":"550 5.1.1 The email account that you tried to reach does not exist. Please try double-checking the recipient's email address for typos or unnecessary spaces. Learn more at https://support.google.com/mail/?p=NoSuchUser d8si10886194edj.16 - gsmtp",
"sg_event_id":"Ym91bmNlLTAtMTU1ODQ2MzUtQ0ZtVHVTQi1UVy1MemljcEZPYUZXQS0w","sg_message_id":"CFmTuSB-TW-LzicpFOaFWA.filterdrecv-p3iad2-8ddf98858-z54vx-21-5E96A76B-2C.0","smtp-id":"<CFmTuSB-TW-LzicpFOaFWA@ismtpd0008p1maa1.sendgrid.net>","status":"5.1.1","timestamp":1586931565,"tls":1,"type":"bounce"}]

[{"email":"doc71@gmail.com","event":"dropped","reason":"Bounced Address","sg_event_id":"ZHJvcC0xNTU4NDYzNS1RRjgzbWpYOFN5bVF2WFJ3SmxEMHlBLTA","sg_message_id":"QF83mjX8SymQvXRwJlD0yA.filterdrecv-p3iad2-8ddf98858-z54vx-21-5E96A78D-1A.0","smtp-id":"<QF83mjX8SymQvXRwJlD0yA@ismtpd0002p1maa1.sendgrid.net>","timestamp":1586931597}]
*/
    public class SendGridEvents
    {
        // Docs: https://sendgrid.com/docs/API_Reference/Webhooks/event.html
        public string email { get; set; }

        public int timestamp { get; set; }

        public int uid { get; set; }

        public int id { get; set; }

        public string sg_event_id { get; set; }

        [JsonProperty("smtp-id")] // switched to underscore for consistancy
        public string smtp_id { get; set; }

        public string sg_message_id { get; set; }

        //[JsonProperty("event")] // event is protected keyword
        public string @event { get; set; }

        public string type { get; set; }

        public string reason { get; set; }

        public string response { get; set; } //incase of delivered event, response will be 250 OK which means the mail has been successfully delivered.

        public string status { get; set; }  //incase of bounce and dropped event, this should contain 5.0.0 with 500 unknown recipient or Bounced Address reason, response property won't be filled

        public string googleEmailId { get; set; }   //custom variable sent to track back the email for which the event was received.
    }
}
