using System;
using System.Threading.Tasks;
using DDDSample1.Domain.Jobs;
using DDDSample1.Domain.Jobs.DTO;
using DDDSample1.Domain.Shared;
using Microsoft.AspNetCore.Mvc;

namespace DDDSample1.Controllers
{
    [Route("api/jobs")]
    [ApiController]
    public class JobsController : ControllerBase
    {
        private readonly JobService _service;

        public JobsController(JobService service)
        {
            _service = service;
        }

        [HttpGet("status")]
        public async Task<ActionResult<string>> Status()
        {
            return Ok("Status ok");
        }

        // POST: api/Jobs
        [HttpPost]
        public async Task<ActionResult<CreatingJobDto>> Create(CreatingJobDto dto)
        {
            // var options = new JsonSerializerOptions
            // {
            //     WriteIndented = true // This sets the indentation
            // };
            // Console.WriteLine("\nhelo\n");
            // Console.WriteLine(JsonSerializer.Serialize(dto, options));
            // Console.WriteLine("\nbye\n");
            var job = await _service.AddAsync(dto);

            return Ok(job);
        }

        // GET: api/jobs/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<string>> GetGetById(string id)
        {
            var job = await _service.GetByIdAsync(id);

            if (job == null)
            {
                return NotFound();
            }

            return Ok(job);
        }

        // PATCH: api/jobs/{id}
        [HttpPatch("{id}")]
        public async Task<ActionResult<JobDto>> Update(string id, UpdatingJobDto dto)
        {
            Console.WriteLine("Hello");

            if (dto == null)
            {
                return BadRequest();
            }

            dto.JobId = id;

            try
            {
                var updatedJob = await _service.UpdateJob(dto);
                return Ok(updatedJob);
            }
            catch (NotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex) when (ex is ArgumentException or BusinessRuleValidationException)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET: api/jobs/non-approved
        [HttpGet("non-approved")]
        public async Task<ActionResult<JobDto[]>> GetNonApproved()
        {
            throw new System.NotImplementedException();
        }

        // GET: api/jobs/filter/{filter}?rule=someRule
        [HttpGet("filter")]
        // GET: api/jobs?filter=filter&rule=someRule
        // [HttpGet], com parametros para filter e rule
        public async Task<ActionResult<String>> GetByFilter(string filter, string rule)
        {
            var dto = FilterMapper.ToDto(filter, rule);
            if (dto == null)
            {
                //TODO: better error message
                return NotFound("Dto asdnull");
            }
            var jobs = await _service.GetByFilter(dto);
            if (jobs == null)
            {
                return NotFound("Akshually not foound");
            }
            return Ok(jobs);
        }

        [HttpGet("")]
        public async Task<ActionResult<JobDto[]>> GetByStatus([FromQuery] string status)
        {
            var jobs = await _service.GetByStatus(status);
            if (jobs == null)
            {
                return NotFound("Tasks not found");
            }

            return Ok(jobs);
        }

        // GET: api/jobs/approved-jobs-sequence
        [HttpGet("approved-jobs-sequence")]
        public async Task<ActionResult<JobDto[]>> GetApprovedJobsSequence()
        {
            throw new System.NotImplementedException();
        }

        [HttpPatch("sequence")]
        public async Task<ActionResult<String>> JobSequence([FromBody] RobotTasksDTO dto)
        {
            var sequence = await _service.JobSequence(dto);
            return Ok(sequence);
        }
    }
}
