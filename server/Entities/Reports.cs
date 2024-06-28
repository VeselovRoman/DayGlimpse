using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Entities
{
public class Report
{
    public int Id { get; set; }
    public int AgentId { get; set; }
     public Agent Agent { get; set; }
    public int RespondentId { get; set; }
    public Respondent Respondent { get; set; }
    public int OperationId { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string Comment { get; set; }
    public TimeSpan Duration => EndTime - StartTime;
}

}