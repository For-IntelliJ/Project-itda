package com.itda.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
public class S3Service {

    private final S3Client s3Client;
    
    // 기본 버킷 (기존)
    private final String bucketName = "itda-kangdy-s3";
    
    // 새로운 버킷 (설정에서 주입 가능)
    // @Value("${aws.s3.bucket:itda-kangdy-s3}")
    // private String bucketName;

    public S3Service(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    // 프로필 이미지 업로드 (기존)
    public String uploadFile(MultipartFile file) throws IOException {
        // UUID로 파일명 중복 방지
        String key = "uploads/" + UUID.randomUUID() + "-" + file.getOriginalFilename();

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(file.getContentType())
                .build();

        s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));

        // 퍼블릭 접근 가능한 URL 리턴 (버킷 정책에 따라 다름)
        return "https://" + bucketName + ".s3.ap-northeast-3.amazonaws.com/" + key;
    }
    
    // 클래스 이미지 업로드 (새로 추가)
    public String uploadClassImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }
        
        // 클래스 이미지는 별도 폴더에 저장
        String key = "classes/" + UUID.randomUUID() + "-" + file.getOriginalFilename();

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(file.getContentType())
                .build();

        s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));

        // 퍼블릭 접근 가능한 URL 리턴
        return "https://" + bucketName + ".s3.ap-northeast-3.amazonaws.com/" + key;
    }
}
