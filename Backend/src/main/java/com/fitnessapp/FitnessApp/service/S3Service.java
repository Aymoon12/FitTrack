package com.fitnessapp.FitnessApp.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ListObjectsV2Request;
import com.amazonaws.services.s3.model.ListObjectsV2Result;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import com.fitnessapp.FitnessApp.model.User;
import com.fitnessapp.FitnessApp.model.WorkoutResponse;
import com.fitnessapp.FitnessApp.repository.UserRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@Log4j2
public class S3Service {

	private final AmazonS3 s3client;
	private final UserRepository userRepository;

	@Value("${aws.s3.bucket}")
	private String bucketName;

	private final String pictureBucket = "ayman-fitness-app-profile-pictures";

	public S3Service(AmazonS3 s3client, UserRepository userRepository) {
		this.s3client = s3client;
		this.userRepository = userRepository;

	}

	public void uploadProfilePic(String keyName, MultipartFile file, Long user_id) {
		try {

			User user = userRepository.findUserById(user_id).orElseThrow(
					() -> new RuntimeException("User not found")
			);
			String fileName = user.getUsername() + "-" + keyName;

			List<String> pictures = getPicturesWithPrefix(user.getUsername());

			if(!pictures.isEmpty()){
				s3client.deleteObject(pictureBucket,pictures.get(0));
			}

			var putObjectResult = s3client.putObject(pictureBucket, fileName, file.getInputStream(), null);
			log.info(putObjectResult.getMetadata());
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

	public S3Object getFile(String keyName) {
		return s3client.getObject(bucketName, keyName);
	}

	public List<String> getPicturesWithPrefix(String prefix) {

		ListObjectsV2Request request = new ListObjectsV2Request()
				.withBucketName(pictureBucket)
				.withPrefix(prefix + "-");

		ListObjectsV2Result result = s3client.listObjectsV2(request);

		List<String> pictureName = result.getObjectSummaries()
				.stream()
				.map(S3ObjectSummary::getKey)
				.toList();


		if(pictureName.isEmpty()){
			return pictureName;
		}

		return pictureName;
	}

	public String getProfilePicture(Long user_id){

		User user = userRepository.findUserById(user_id).orElseThrow(
				() -> new RuntimeException("User not found")
		);

		ListObjectsV2Request request = new ListObjectsV2Request()
				.withBucketName(pictureBucket)
				.withPrefix(user.getUsername() + "-");

		ListObjectsV2Result result = s3client.listObjectsV2(request);

		List<String> pictureName = result.getObjectSummaries()
				.stream()
				.map(S3ObjectSummary::getKey)
				.toList();
		System.out.println(pictureName);

		if(pictureName.isEmpty()){
			return "No Picture Found";
		}

		return s3client.getUrl(pictureBucket,pictureName.get(0)).toString();
	}

	public List<WorkoutResponse> getWorkouts(String muscleGroup) {
		String prefix = muscleGroup + '_';

		ListObjectsV2Request request = new ListObjectsV2Request()
				.withBucketName(bucketName)
				.withPrefix(prefix);

		ListObjectsV2Result result = s3client.listObjectsV2(request);

		List<String> pictureNames = result.getObjectSummaries()
				.stream()
				.map(S3ObjectSummary::getKey)
				.toList();

		List<WorkoutResponse> workouts = new ArrayList<>();

		for (String pictureName : pictureNames) {
			WorkoutResponse response = new WorkoutResponse();
			response.setMuscleGroup(muscleGroup);

			// Create a URL for the picture
			String pictureUrl = s3client.getUrl(bucketName, pictureName).toString();
			response.setPictureURL(pictureUrl);

			int index = pictureName.indexOf('_');
			int endIndex = pictureName.indexOf('.');
			if (index != -1 && endIndex != -1 && endIndex > index) {
				String pic = pictureName.substring(index + 1, endIndex);
				pic = pic.replaceAll("_", " ");
				response.setName(pic);

			} else {
				response.setName(pictureName); // Fallback if the format is unexpected
			}

			workouts.add(response);
		}

		return workouts;
	}


}
