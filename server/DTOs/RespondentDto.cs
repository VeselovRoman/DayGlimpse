namespace server.DTOs
{
    public class RespondentDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime RegistrationDate { get; set; }
        public string City { get; set; }
        public int BranchId { get; set; }
    }
}
