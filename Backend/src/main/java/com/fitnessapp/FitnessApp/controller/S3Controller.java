package com.fitnessapp.FitnessApp.controller;

import com.fitnessapp.FitnessApp.model.WorkoutResponse;
import com.fitnessapp.FitnessApp.service.S3Service;
import lombok.AllArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/s3")
@CrossOrigin
public class S3Controller {

	private final S3Service s3Service;

	public S3Controller(S3Service s3Service) {
		this.s3Service = s3Service;
	}


	@PostMapping(path = "/upload", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
	public String uploadProfilePic(@RequestParam("file") MultipartFile file,
								   @RequestParam Long user_id)  {
		s3Service.uploadProfilePic(file.getOriginalFilename(), file,user_id);
		return "File uploaded";
	}

	@GetMapping("/download/{fileName}")
	public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
		return ResponseEntity.ok()
				.contentType(MediaType.APPLICATION_OCTET_STREAM)
				.body(new InputStreamResource(s3Service.getFile(fileName).getObjectContent()));
	}

	@GetMapping("/view/{fileName}")
	public ResponseEntity<InputStreamResource> viewFile(@PathVariable String fileName) {
		var s3Object = s3Service.getFile(fileName);
		var content = s3Object.getObjectContent();
		return ResponseEntity.ok()
				.contentType(MediaType.IMAGE_PNG) // This content type can change by your file :)
				.header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\""+fileName+"\"")
				.body(new InputStreamResource(content));
	}

	@GetMapping("/getWorkout")
	public ResponseEntity<List<WorkoutResponse>> getWorkout(@RequestParam String muscleGroup) {
		return ResponseEntity.ok(s3Service.getWorkouts(muscleGroup));
	}

	@GetMapping("/getProfilePicture")
	public ResponseEntity<String> getProfilePicture(@RequestParam Long user_id) {
		return ResponseEntity.ok(s3Service.getProfilePicture(user_id));
	}

}
